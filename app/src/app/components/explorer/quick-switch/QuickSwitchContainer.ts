import { connect } from 'react-redux';
import { IStoreState } from '../../../types';
import { Dispatch } from 'redux';
import { actions, micropadAction } from '../../../actions';
import QuickSwitchComponent from './QuickSwitchComponent';

export const quickSwitchConnector = connect(
	(state: IStoreState) => ({
		notepadTitles: state.notepads.savedNotepadTitles ?? [],
		currentTitle: state.notepads.notepad?.item?.title
	}),
	(dispatch: Dispatch<micropadAction>) => ({
		loadNotepad: (notepadTitle: string) => dispatch(actions.openNotepadFromStorage.started(notepadTitle))
	})
);

export default quickSwitchConnector(QuickSwitchComponent);
