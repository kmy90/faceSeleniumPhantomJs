export interface Step {
    findElement_x?: FindElement_x;
    action_x: Action_x;
    start_action_time_x?:string; 
    end_action_time_x?:string; 
}

export interface Action_x {
  type_x?:string;
  value_x?:string;
  timeout_x?:number;
  keypress_x?:string;
  includes_x?:string;
  for_x?:string;
}

export interface FindElement_x {
    nodeName_x:string,
    attributes_x:Attribute_x[]
}

export interface Attribute_x {
    name_x:string,
    value_x:string
}
