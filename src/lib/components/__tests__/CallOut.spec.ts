import { render } from '@testing-library/svelte';
import CallOut from '../CallOut.svelte';
import { describe, it, expect } from 'vitest';

describe('CallOut', () => {
	it('renders the title and content', () => {
		const { getByText } = render(CallOut, {
			props: {
				title: 'Test Title',
				content: 'This is a test message.'
			}
		});

		// Check that the title and content appear in the document
		expect(getByText('Test Title')).toBeInTheDocument();
		expect(getByText('This is a test message.')).toBeInTheDocument();
	});
});
