import { combineEpics, ofType } from 'redux-observable';
import { catchError, debounceTime, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { actions, micropadAction, micropadActions } from '../actions';
import { EpicDeps, EpicStore } from './index';
import { indexNotepads, search } from '../services/SearchService';
import { IStoreState } from '../types';

export const refreshIndices$ = (action$: Observable<micropadAction>) =>
	action$.pipe(
		ofType(actions.saveNotepad.done.type, actions.deleteNotepad.type),
		map(() => actions.indexNotepads.started())
	);

export const indexNotepads$ = (action$: Observable<micropadAction>, state$: EpicStore) =>
	action$.pipe(
		ofType(actions.indexNotepads.started.type),
		withLatestFrom(state$),
		switchMap(([,state]) =>
			from(indexNotepads(state.search.indices, state.notepadPasskeys)).pipe(
				map(newIndices => actions.indexNotepads.done({ params: undefined, result: newIndices })),
				catchError(err => {
					console.error(err);
					return of(actions.indexNotepads.failed({ params: undefined, error: err }));
				})
			)
		)
	);

export const search$ = (action$: Observable<micropadAction>, state$: EpicStore) =>
	action$.pipe(
		ofType(actions.search.started.type),
		debounceTime(100),
		map(action => (action as micropadActions['search']['started'])),
		map(action => action.payload.trim()),
		withLatestFrom(state$),
		map(([query, state]) => actions.search.done({
			params: query,
			result: search(query, state.search.indices)
		}))
	);

export const searchEpics$ = combineEpics<micropadAction, micropadAction, IStoreState, EpicDeps>(
	refreshIndices$,
	indexNotepads$,
	search$
);
