// js/overview.js
document.addEventListener('DOMContentLoaded', () => {
    const contactList = document.getElementById('contact-list');
    const chatArea = document.getElementById('chat-area');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const contactName = document.getElementById('contact-name');
    const contactStatus = document.getElementById('contact-status');
    const searchContacts = document.getElementById('search-contacts');

    // Sample contacts (professionals or students)
    const contacts = [
        { id: 1, name: 'Vikram Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', lastMessage: 'Hi, let’s discuss the PPT!', timestamp: '10:30 AM', status: 'online' },
        { id: 2, name: 'Sneha Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D', lastMessage: 'Code review done.', timestamp: '09:15 AM', status: 'offline' },
        { id: 3, name: 'Rahul Mehta', avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg', lastMessage: 'Meeting at 2 PM?', timestamp: 'Yesterday', status: 'typing...' },
    ];

    // Sample messages for each contact
    const messages = {
        1: [
            { id: 1, text: 'Hi, let’s discuss the PPT!', sender: 'Vikram Sharma', time: '10:30 AM', sent: false },
            { id: 2, text: 'Sure, I’ll prepare the slides.', sender: 'You', time: '10:32 AM', sent: true },
        ],
        2: [
            { id: 1, text: 'Code review done.', sender: 'Sneha Patel', time: '09:15 AM', sent: false },
            { id: 2, text: 'Great, thanks!', sender: 'You', time: '09:17 AM', sent: true },
        ],
        3: [
            { id: 1, text: 'Meeting at 2 PM?', sender: 'Rahul Mehta', time: 'Yesterday', sent: false },
            { id: 2, text: 'Yes, I’ll be there.', sender: 'You', time: 'Yesterday', sent: true },
        ],
    };

    // Populate contact list
    function renderContacts(filter = '') {
        contactList.innerHTML = '';
        contacts
            .filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(contact => {
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item';
                contactItem.innerHTML = `
                    <img src="${contact.avatar}" alt="${contact.name}" class="avatar">
                    <div class="contact-details">
                        <h4>${contact.name}</h4>
                        <p>${contact.lastMessage}</p>
                    </div>
                    <span class="timestamp">${contact.timestamp}</span>
                `;
                contactItem.addEventListener('click', () => openChat(contact));
                contactList.appendChild(contactItem);
            });
    }

    // Open chat for selected contact
    function openChat(contact) {
        chatArea.style.display = 'flex';
        contactName.textContent = contact.name;
        contactStatus.textContent = contact.status;
        renderMessages(contact.id);
    }

    // Render messages for selected contact
    function renderMessages(contactId) {
        chatMessages.innerHTML = '';
        messages[contactId].forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sent ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `<p>${msg.text} <span class="time">${msg.time}</span></p>`;
            chatMessages.appendChild(messageDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message
    window.sendMessage = function() {
        const text = messageInput.value.trim();
        if (text) {
            const activeContact = contacts.find(c => c.name === contactName.textContent);
            if (activeContact) {
                const message = {
                    id: Date.now(),
                    text: text,
                    sender: 'You',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sent: true,
                };
                messages[activeContact.id] = messages[activeContact.id] || [];
                messages[activeContact.id].push(message);
                renderMessages(activeContact.id);
                messageInput.value = '';
            }
        }
    };

    // Search contacts
    searchContacts.addEventListener('input', (e) => renderContacts(e.target.value));

    // Initial load
    renderContacts();
    chatArea.style.display = 'none'; // Hide chat area until a contact is selected

    // Simulate typing status (optional)
    setInterval(() => {
        const typingContact = contacts.find(c => c.status === 'typing...');
        if (typingContact) {
            contactStatus.textContent = 'online';
            setTimeout(() => {
                if (contactName.textContent === typingContact.name) {
                    contactStatus.textContent = 'typing...';
                }
            }, 2000);
        }
    }, 5000);
});