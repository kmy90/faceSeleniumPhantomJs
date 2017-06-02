export interface Step {
    findElement_x?: FindElement_x;
    action_x: Action_x;
}

export interface Action_x {
  type_x?:any;
  value_x?:any;
  timeout_x?:number;
  keypress_x?:any;
  includes_x?:any;
  for_x?:any;
}

export interface FindElement_x {
    nodeName_x:string,
    attributes_x:any
}