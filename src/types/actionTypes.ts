import moment from "moment";

export enum toggleActionType {
  TOGGLE_SERIES = "TOGGLE_SERIES",
  TOGGLE_AGGREGATION = "TOGGLE_AGGREGATION",
  TOGGLE_ALLTECHNOLOGIES = "TOGGLE_ALLTECHNOLOGIES",
}

export enum dataActionType {
  SET_DATE = "SET_DATE",
  SET_CATEGORY = "SET_CATEGORY",
  SET_SUBCATEGORIES = "SET_SUBCATEGORIES",
  SET_TECHNOLOGIES = "SET_TECHNOLOGIES",
}

export type toggleAction =
  | {
      type: toggleActionType.TOGGLE_SERIES;
      payload: boolean;
    }
  | {
      type: toggleActionType.TOGGLE_AGGREGATION;
      payload: boolean;
    }
  | {
      type: toggleActionType.TOGGLE_ALLTECHNOLOGIES;
      payload: boolean;
    };

export type dataAction =
  | {
      type: dataActionType.SET_DATE;
      payload: [moment.Moment, moment.Moment];
    }
  | {
      type: dataActionType.SET_CATEGORY;
      payload: string;
    }
  | {
      type: dataActionType.SET_SUBCATEGORIES;
      payload: string[];
    }
  | {
      type: dataActionType.SET_TECHNOLOGIES;
      payload: number[];
    };