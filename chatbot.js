
// Chatbot Logic
document.addEventListener('DOMContentLoaded', () => {
    injectChatbot();
});

function injectChatbot() {
    // Only inject if not already present
    if (document.getElementById('chat-widget')) return;

    const chatHTML = `
        <div id="chat-widget" class="chat-widget">
            <div class="chat-header">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="font-size:1.2rem;">🤖</span>
                    <span style="font-weight:600;">Integration Assistant</span>
                </div>
                <!-- Toggle handled by external button -->
            </div>
            <div class="chat-body" id="chat-body">
                <div class="chat-message bot">
                    Hello! I have access to all integration data. Ask me about flight risks, revenue impact, or specific accounts.
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Ask a question..." onkeypress="handleChatKey(event)">
                <button onclick="sendChat()">Send</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
}

let isChatOpen = false;

function toggleChat() {
    const widget = document.getElementById('chat-widget');
    const trigger = document.getElementById('chat-trigger');
    widget.classList.toggle('open');
    trigger.classList.toggle('active');

    if (widget.classList.contains('open')) {
        trigger.textContent = '×';
        document.getElementById('chat-input').focus();
    } else {
        trigger.textContent = '💬';
    }
    isChatOpen = !isChatOpen;
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendChat();
}

function sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';

    // Simulate AI processing
    setTimeout(() => {
        const response = generateResponse(msg);
        addMessage(response, 'bot');
    }, 600);
}

function addMessage(text, sender) {
    const body = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function generateResponse(query) {
    const q = query.toLowerCase();

    if (typeof RAW_DATA === 'undefined') return "I'm still connecting to the data source. Please try again in a moment.";

    // Basic heuristics for demo
    if (q.includes('risk') && q.includes('high')) {
        const highRisk = RAW_DATA.talent.filter(e => e.riskScore > 80);
        return `I found ${highRisk.length} employees with Critical/High flight risk. The highest risk individuals are mostly in the ${highRisk[0].function} function.`;
    }

    if (q.includes('revenue') || q.includes('money')) {
        const totalRisk = RAW_DATA.health.totalRevenueAtRisk;
        return `The current total Revenue at Risk is $${(totalRisk / 1000000).toFixed(1)}M. This is driven primarily by key account relationships held by at-risk talent.`;
    }

    if (q.includes('pepsico')) {
        const account = RAW_DATA.accounts.find(a => a.name === 'PepsiCo');
        if (account) return `PepsiCo is a key account with $${(account.totalRevenue / 1000000).toFixed(1)}M in revenue. It currently has a People Risk Score of ${account.peopleRiskScore} (High).`;
    }

    if (q.includes('coca')) {
        const account = RAW_DATA.accounts.find(a => a.name === 'Coca-Cola');
        if (account) return `Coca-Cola generates $${(account.totalRevenue / 1000000).toFixed(1)}M. The team size is ${account.teamSize}, and risk is moderate.`;
    }

    if (q.includes('talent') || q.includes('people')) {
        return `We are tracking ${RAW_DATA.talent.length} employees from the acquisition. 24% are currently flagged as flight risks.`;
    }

    return "I can answer questions about Talent Risk, Revenue Impact, or specific Accounts. Try asking: 'How much revenue is at risk?' or 'Show me high risk talent'.";
}
