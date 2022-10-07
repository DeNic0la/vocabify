import {ButtonColor, ButtonSize} from "../../ui/button/button.types";

export interface HeaderAction {
  prompt: string,
  size: ButtonSize,
  color: ButtonColor,
  action: Function
}
