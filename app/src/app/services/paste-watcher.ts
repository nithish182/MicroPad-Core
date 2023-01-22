import { actions } from '../actions';
import { micropadStore } from '../root';

export function watchPastes(store: micropadStore) {
	document.addEventListener('paste', event => {
		let file: File | undefined;
		if (!!event.clipboardData && !!event.clipboardData.items) {
			file = Array.from(event.clipboardData.items)
				.filter(item => item.kind === 'file')
				.map(file => file.getAsFile())
				.filter((file): file is File => !!file)?.[0];
			event.clipboardData.items.clear();
		} else if (!!event.clipboardData && !!event.clipboardData.files) {
			file = event.clipboardData.files?.[0];
			event.clipboardData.clearData();
		}

		if (!file) return;
		store.dispatch(actions.filePasted(file));
	})
}