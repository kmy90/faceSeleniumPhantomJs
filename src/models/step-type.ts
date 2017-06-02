export interface Step {
    findElement_x?: FindElement_x;
    action_x: Action_x;
}

export interface Action_x {
  type_x?:string;
  for_x?:string;
  includes_x?:string;
  timeout_x?:number;
  value_x?:string;
}


export interface FindElement_x {
    nodeName_x:string,
    attributes_x:any
}