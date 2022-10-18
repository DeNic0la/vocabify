import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { AiService } from './ai.service';
import { Round } from '../types/round';
import { Story } from '../types/story';
import { Participant } from '../types/participant';
import { LobbyService } from './lobby.service';

export class GameService {
  private db = admin.firestore();
  private aiService = new AiService();

  public async submit(uid: string, lobby: Lobby, sentence: string) {
    if (sentence.length > 100) throw new Error('The text is too long');
    if (lobby.state === LobbyState.SUBMITTING) {
      const story: Story = {
        uid,
        sentence,
        userRatings: [],
      };
      const round = await this.getLastRound(lobby.id);
      let submittedStories = round.data().submittedStories;
      submittedStories.push(story);
      await this.db
        .collection('lobbies')
        .doc(lobby.id)
        .collection('rounds')
        .doc(round.id)
        .update({ submittedStories });
    } else {
      throw new Error(
        'You cannot submit your sentence in the current lobby state'
      );
    }
  }

  public async changeState(uid: string, lobby: Lobby, state: LobbyState) {
    if (lobby.hostid !== uid) {
      throw new Error('Not Authorized');
    }
    if (
      (lobby.state === LobbyState.RANKING && state === LobbyState.SUBMITTING) ||
      (lobby.state === LobbyState.JOINING && state === LobbyState.SUBMITTING)
    ) {
      await this.createRound(lobby.id);
    }
    if (lobby.state === LobbyState.EVALUATED && state === LobbyState.WINNER) {
      await this.addPointsToMostVoted(lobby);
    }
    await this.db.collection('lobbies').doc(lobby.id).update({ state });
  }

  public async evaluate(lobby: Lobby) {
    const round = await this.getLastRound(lobby.id);
    if (round.data().winner !== -1) {
      throw new Error('The evaluation was already triggered');
    }
    const firebaseSentences: Story[] = round.data().submittedStories;
    const stories: string[] = [];
    for (let story of firebaseSentences) {
      stories.push(story.sentence);
    }

    let sortedSentences = '';
    let sortedArray: string[] = [];
    if (stories.length >= 1) {
      if (stories.length > 1) {
        sortedSentences = await this.aiService.getSortedSentences(
          stories,
          lobby
        );
      } else {
        sortedSentences = stories[0];
      }
      console.log(sortedSentences);
      sortedArray = sortedSentences.split('\n');
    } else {
      await new LobbyService().deleteLobby(lobby.id);
      return;
    }

    const participants = await new LobbyService().getParticipants(lobby.id);
    let rank = participants.length;
    for (let x = 0; x < sortedArray.length; x++) {
      for (let i = 0; i < firebaseSentences.length; i++) {
        if (sortedArray[x].includes(firebaseSentences[i].sentence)) {
          if (rank === participants.length) {
            await this.db
              .collection('lobbies')
              .doc(lobby.id)
              .collection('rounds')
              .doc(round.id)
              .update({ winner: i });
            lobby.story.push({
              uid: firebaseSentences[i].uid,
              sentence: firebaseSentences[i].sentence,
              userRatings: firebaseSentences[i].userRatings,
            });
            await this.db
              .collection('lobbies')
              .doc(lobby.id)
              .update({ story: lobby.story });
          }
          await this.addPoints(firebaseSentences[i].uid, lobby.id, rank * 50);
          rank--;
        }
      }
    }
  }

  public async rate(uid: string, lobby: Lobby, storyUid: any) {
    if (uid === storyUid) throw new Error('You cannot vote for your story');

    const roundFirebase = (await this.getLastRound(lobby.id)).data();
    let round: Round = {
      createdAt: roundFirebase.createdAt,
      submittedStories: roundFirebase.submittedStories,
      winner: roundFirebase.winner,
    };

    if (!this.hasAlreadyVoted(uid, round.submittedStories)) {
      for (let i = 0; i < round.submittedStories.length; i++) {
        if (round.submittedStories[i].uid === storyUid) {
          round.submittedStories[i].userRatings.push(uid);
          const roundRef = this.getRoundById(
            lobby.id,
            round.createdAt.toString()
          );
          await roundRef.update({ submittedStories: round.submittedStories });
          break;
        }
      }
    } else {
      throw new Error('You only can vote once');
    }
  }

  private async addPointsToMostVoted(lobby: Lobby) {
    const round = await this.getLastRound(lobby.id);
    let bestStory = round.data().submittedStories[0];

    for (let story of round.data().submittedStories) {
      if (bestStory.userRatings.length < story.userRatings.length) {
        bestStory = story;
      }
    }
    const participants = await new LobbyService().getParticipants(lobby.id);
    await this.addPoints(bestStory.uid, lobby.id, participants.length * 25);
  }

  private hasAlreadyVoted(uid: string, stories: Story[]) {
    for (let i = 0; i < stories.length; i++) {
      for (let j = 0; j < stories[i].userRatings.length; j++) {
        if (stories[i].userRatings[j] === uid) {
          return true;
        }
      }
    }
    return false;
  }

  private async addPoints(uid: string, lobbyId: string, points: number) {
    const participantRef = this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('participants')
      .doc(uid);
    const particpant = <Participant>(await participantRef.get()).data();
    await participantRef.update({ points: particpant.points + points });
  }

  private async createRound(lobbyId: string) {
    const round: Round = {
      createdAt: Date.now(),
      submittedStories: [],
      winner: -1,
    };
    await this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('rounds')
      .doc(Date.now().toString())
      .set(round, { merge: true });
  }

  private async getLastRound(lobbyId: string) {
    const firebaseRound = await (
      await this.db
        .collection('lobbies')
        .doc(lobbyId)
        .collection('rounds')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()
    ).docs[0];
    if (!firebaseRound || !firebaseRound.exists) {
      throw new Error(
        'You cannot submit your sentence in the current lobby state'
      );
    }
    return firebaseRound;
  }

  private getRoundById(lobbyId: string, roundId: string) {
    return this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('rounds')
      .doc(roundId);
  }
}
