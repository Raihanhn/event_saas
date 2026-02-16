//modules/events/event.types/ts

import { Types } from "mongoose";

export interface IEventLean {
  _id: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  budgets: any[];
  organization: Types.ObjectId;
}
