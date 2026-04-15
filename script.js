/*
	Seed script for creating 7 varied notes for one user.
	Usage:
		1) Start backend server on http://localhost:5000
		2) Run: node script.js
*/

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

const user = {
	name: 'test',
	email: 'test@email',
	password: '123456',
};

const notes = [
	{
		title: 'Daily Journal - Monday Reflection',
		content:
			'Today I focused on deep work for two hours and finished the draft for the notes feature. Energy was high in the morning, but I felt distracted after lunch. Tomorrow I will block social media from 2 PM to 5 PM.',
		tags: ['journal', 'productivity', 'personal'],
	},
	{
		title: 'Sprint Planning Meeting Notes',
		content:
			'Meeting outcomes: move semantic search to current sprint, add debounce to frontend search input, and create a dedicated search API endpoint. Action items assigned to backend and frontend owners. Deadline Friday.',
		tags: ['meeting', 'work', 'sprint'],
	},
	{
		title: 'Weekend Grocery Checklist',
		content:
			'Milk, oats, eggs, spinach, bananas, tomatoes, paneer, coffee beans, and paper towels. Check discounts on whole grains and protein options before checkout.',
		tags: ['checklist', 'home', 'shopping'],
	},
	{
		title: 'Startup Idea - AI Study Coach',
		content:
			'Concept: an AI coach that tracks weak topics, builds a revision plan, and schedules short practice sessions. Possible users are college students preparing for technical interviews.',
		tags: ['ideas', 'startup', 'ai'],
	},
	{
		title: 'Research Summary - Vector Search Basics',
		content:
			'Vector search converts text into embeddings and retrieves semantically similar content using cosine similarity or dot product. Hybrid ranking often combines semantic and keyword relevance for better quality.',
		tags: ['research', 'ml', 'semantic-search'],
	},
	{
		title: 'Travel Plan - Jaipur 3 Day Itinerary',
		content:
			'Day 1: City Palace and Jantar Mantar. Day 2: Amer Fort and local market food walk. Day 3: Nahargarh sunrise and shopping for handicrafts. Keep budget around 10k excluding travel.',
		tags: ['travel', 'plan', 'itinerary'],
	},
	{
		title: 'Learning Log - MERN Stack Progress',
		content:
			'Learned how JWT auth works, built CRUD routes with Express, connected React UI to backend, and added semantic search flow. Next: integrate real embeddings and add pagination.',
		tags: ['learning', 'mern', 'development'],
	},
];

const request = async (path, options = {}) => {
	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		const message = data.message || `Request failed: ${response.status}`;
		throw new Error(message);
	}
	return data;
};

const signInOrSignUp = async () => {
	try {
		return await request('/api/auth/signin', {
			method: 'POST',
			body: JSON.stringify({ email: user.email, password: user.password }),
		});
	} catch (error) {
		if (!String(error.message).toLowerCase().includes('invalid credentials')) {
			throw error;
		}

		console.log('User not available for signin. Creating account first...');
		return request('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify(user),
		});
	}
};

const createNotes = async (token) => {
	for (const note of notes) {
		const created = await request('/api/notes', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(note),
		});

		console.log(`Created: ${created.title}`);
	}
};

const run = async () => {
	try {
		console.log(`Using API: ${BASE_URL}`);
		const auth = await signInOrSignUp();
		await createNotes(auth.token);
		console.log('Done. 7 notes created successfully.');
	} catch (error) {
		console.error('Script failed:', error.message);
		process.exitCode = 1;
	}
};

run();
