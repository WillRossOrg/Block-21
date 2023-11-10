document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-acc-et-web-pt-a/events';
    const partyList = document.getElementById('partyList');
    const form = document.getElementById('newPartyForm');

    // Fetch parties from API
    async function fetchParties() {
        try {
            const response = await fetch(apiBaseUrl);
            const data = await response.json();
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error.message);
            }
        } catch (error) {
            console.error('Error fetching parties:', error);
            return [];
        }
    }

    // Render parties to the page
    async function renderParties() {
        const parties = await fetchParties();
        partyList.innerHTML = '';
        parties.forEach((party) => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class="party-info"><strong>Name:</strong> ${party.name}</div>
            <div class="party-info"><strong>Date:</strong> ${new Date(party.date).toLocaleDateString()}</div>
            <div class="party-info"><strong>Time:</strong> ${new Date(party.date).toLocaleTimeString()}</div>
            <div class="party-info"><strong>Location:</strong> ${party.location}</div>
            <div class="party-info"><strong>Description:</strong> ${party.description}</div>
            <button onclick="deleteParty(${party.id})" class="delete-button">Delete</button>
        `;
            partyList.appendChild(li);
        });
    }

    // Add a new party
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const newParty = {
            name: document.getElementById('partyName').value,
            description: document.getElementById('partyDescription').value,
            date: document.getElementById('partyDate').value,
            location: document.getElementById('partyLocation').value
        };

        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newParty)
            });

            const data = await response.json();
            if (data.success) {
                renderParties();
            } else {
                throw new Error(data.error.message);
            }
        } catch (error) {
            console.error('Error adding new party:', error);
        }

        form.reset();
    });

     // Delete a party
    window.deleteParty = async (id) => {
        try {
            const response = await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
            if (response.status === 204) {
                renderParties();
            } else {
                throw new Error('Error deleting party');
            }
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    };

    renderParties();
});
// Function to handle new party submissions
form.addEventListener('submit', async event => {
    event.preventDefault();
    const newParty = {
        name: document.getElementById('partyName').value,
        description: document.getElementById('partyDescription').value,
        date: document.getElementById('partyDate').value,
        location: document.getElementById('partyLocation').value
    };

    try {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newParty)
        });

        const data = await response.json();
        if (data.success) {
            // After adding a new party, re-fetch and render the updated list
            renderParties();
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Error adding new party:', error);
    }

    form.reset();
});