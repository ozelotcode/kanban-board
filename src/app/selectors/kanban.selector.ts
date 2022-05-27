import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const selectBoard = createSelector(
    createFeatureSelector('kanbanBoard'),
    (state: AppState) => state
)