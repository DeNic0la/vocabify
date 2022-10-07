import {Injectable} from "@angular/core";
import {HeaderAction} from "./types/header-action.type";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private action: HeaderAction | undefined;

  public setAction(action: HeaderAction | undefined) {
    this.action = action;
  }

  public getAction(): HeaderAction | undefined {
    return this.action;
  }
}
