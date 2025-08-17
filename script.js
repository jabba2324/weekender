const techOptions = {
    frontend: [
        { name: "Vanilla HTML/CSS/JS", icon: "🌐" },
        { name: "React", icon: "⚛️" },
        { name: "Vue.js", icon: "💚" },
        { name: "Flutter", icon: "🦋" },
        { name: "Svelte", icon: "🧡" },
        { name: "Angular", icon: "🅰️" },
        { name: "Blazor", icon: "🔥" }
    ],
    backend: [
        { name: "Node.js", icon: "🟢" },
        { name: "Python", icon: "🐍" },
        { name: "C#", icon: "🔷" },
        { name: "Perl", icon: "🐪" },
        { name: "Ruby", icon: "💎" },
        { name: "Java", icon: "☕" },
        { name: "Go", icon: "🐹" },
        { name: "Rust", icon: "🦀" },
        { name: "Kotlin", icon: "🟣" },
        { name: "Swift", icon: "🐦" },
        { name: "Scala", icon: "🔺" },
        { name: "F#", icon: "🔵" }
    ],
    database: [
        { name: "MongoDB", icon: "🍃" },
        { name: "Duck DB", icon: "🦆" },
        { name: "MS SQL Server", icon: "🏢" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "SQLite", icon: "💾" },
        { name: "Firebase", icon: "🔥" },
        { name: "MySQL", icon: "🐬" }
    ],
    ai: [
        { name: "Claude Sonnet", icon: "🎭" },
        { name: "GPT 4o", icon: "🤖" },
        { name: "Ministral Chat", icon: "🧠" },
        { name: "Google Gemini", icon: "💎" },
        { name: "Perplexity Sonar", icon: "🔍" },
        { name: "Grok", icon: "⚡" }
    ]
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function generateIdea() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('Please enter your OpenAI API key');
        return;
    }

    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{
                    role: 'user',
                    content: 'Generate a web app idea that uses generative AI and can be built in a weekend, the idea should be some kind of utility or tool. Return a JSON object with: title (string), description (string), and userFlows (array of 3 strings).'
                }],
                max_tokens: 200,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message.content) {
            throw new Error('Empty response from API');
        }
        
        const appData = JSON.parse(data.choices[0].message.content);
        
        const stack = {
            frontend: getRandomItem(techOptions.frontend),
            backend: getRandomItem(techOptions.backend),
            database: getRandomItem(techOptions.database),
            ai: getRandomItem(techOptions.ai)
        };

        const userFlowsHtml = appData.userFlows ? `
            <div class="user-flows">
                <h4>Core User Flows:</h4>
                <ul>
                    ${appData.userFlows.map(flow => `<li>${flow}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        document.getElementById('appIdea').innerHTML = `
            <div class="app-title">💡 ${appData.title}</div>
            <div class="app-description">${appData.description}</div>
            ${userFlowsHtml}
        `;
        
        const techStackHtml = Object.entries(stack).map(([category, tech]) => `
            <div class="tech-category">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div class="tech-item">
                    <span>${tech.icon}</span>
                    <span>${tech.name}</span>
                </div>
            </div>
        `).join('');
        
        document.getElementById('techStack').innerHTML = techStackHtml;
        document.getElementById('result').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating idea. Please check your API key or try again.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Generate Weekend Project';
    }
}