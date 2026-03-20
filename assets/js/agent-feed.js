/**
 * Agent Feed
 * Data and rendering for the Agent Feed page.
 */

(function () {
    const feedAgents = [
        {
            id: 'fix-memory-leak',
            goal: 'Fix memory leak in WebSocket connection handler',
            status: 'waiting',
            statusLabel: 'Waiting for input',
            time: '1h',
            avatar: 'goose',
            avatarLabel: 'Go',
            projectName: 'API Gateway',
            project: 'acme/realtime-svc',
            branch: 'fix/ws-memory-leak',
            progress: 45,
            progressSteps: '2 / 4',
            activity: null,
            question: {
                text: 'I found two connection pool implementations: <code>LegacyPool</code> in <code>src/pool/legacy.ts</code> and <code>AsyncPool</code> in <code>src/pool/async.ts</code>. Which one should I refactor to fix the leak? Or should I consolidate both into a single implementation?',
                options: [
                    { label: 'Refactor AsyncPool', type: 'primary' },
                    { label: 'Consolidate both', type: 'secondary' },
                    { label: 'Let me check first', type: 'secondary' }
                ],
                allowReply: true
            }
        },
        {
            id: 'refactor-auth',
            goal: 'Refactor authentication module to use JWT tokens',
            status: 'waiting',
            statusLabel: 'Waiting for input',
            time: '12m',
            avatar: 'claude',
            avatarLabel: 'Cl',
            projectName: 'Kortex Backend',
            project: 'acme/backend',
            branch: 'feat/jwt-auth',
            progress: 55,
            progressSteps: '3 / 5',
            activity: null,
            question: {
                text: '<svg style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg><strong style="color:#fca5a5">Network blocked:</strong> I need to reach <code>auth.example.com</code> to fetch JWKS public keys for JWT verification, but the workspace network policy denied the request. How should I proceed?',
                options: [
                    { label: 'Allow auth.example.com', type: 'primary' },
                    { label: 'Allow for session only', type: 'secondary' },
                    { label: 'Use local key instead', type: 'secondary' }
                ],
                allowReply: true
            }
        },
        {
            id: 'add-dark-mode',
            goal: 'Add dark mode toggle to settings page',
            status: 'running',
            statusLabel: 'Running',
            time: '34m',
            avatar: 'cursor',
            avatarLabel: 'Cu',
            projectName: 'Frontend App',
            project: 'acme/frontend',
            branch: 'feat/dark-mode',
            progress: 30,
            progressSteps: '1 / 4',
            activity: { text: 'Reading src/components/Settings.tsx', type: 'reading' },
            question: null
        },
        {
            id: 'api-rate-limit',
            goal: 'Implement API rate limiting middleware',
            status: 'waiting',
            statusLabel: 'Waiting for input',
            time: '45m',
            avatar: 'claude',
            avatarLabel: 'Cl',
            projectName: 'Kortex Backend',
            project: 'acme/backend',
            branch: 'feat/rate-limit',
            progress: 70,
            progressSteps: '3 / 4',
            activity: null,
            question: {
                text: 'The rate limiter is ready. Should I use a <code>sliding window</code> or <code>token bucket</code> algorithm? Sliding window is simpler but token bucket handles bursts better.',
                options: [
                    { label: 'Sliding window', type: 'primary' },
                    { label: 'Token bucket', type: 'primary' }
                ],
                allowReply: true
            }
        },
        {
            id: 'api-docs',
            goal: 'Generate OpenAPI docs for REST endpoints',
            status: 'paused',
            statusLabel: 'Paused',
            time: '3h',
            avatar: 'cursor',
            avatarLabel: 'Cu',
            projectName: 'Kortex Backend',
            project: 'acme/backend',
            branch: 'docs/openapi-spec',
            progress: 55,
            progressSteps: '3 / 6',
            activity: null,
            question: null
        },
        {
            id: 'update-deps',
            goal: 'Update npm dependencies and fix breaking changes',
            status: 'completed',
            statusLabel: 'Completed',
            time: '2h ago',
            avatar: 'claude',
            avatarLabel: 'Cl',
            projectName: 'Frontend App',
            project: 'acme/frontend',
            branch: 'chore/update-deps',
            progress: 100,
            progressSteps: '5 / 5',
            activity: null,
            question: null
        },
        {
            id: 'dockerfile',
            goal: 'Create multi-stage Dockerfile for production',
            status: 'completed',
            statusLabel: 'Completed',
            time: '5h ago',
            avatar: 'goose',
            avatarLabel: 'Go',
            projectName: 'Kortex Backend',
            project: 'acme/backend',
            branch: 'infra/docker-prod',
            progress: 100,
            progressSteps: '4 / 4',
            activity: null,
            question: null
        }
    ];

    function buildActivityIcon(type) {
        if (type === 'writing') {
            return '<svg class="activity-spinner" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        }
        if (type === 'reading') {
            return '<svg class="activity-spinner" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        }
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
    }

    function buildCard(agent) {
        var isInput = agent.status === 'waiting';
        var cardClass = isInput ? 'feed-card needs-input' : 'feed-card';

        var activityHTML = '';
        if (agent.activity) {
            activityHTML = '<div class="feed-card-activity">' +
                buildActivityIcon(agent.activity.type) +
                '<span class="feed-card-activity-text">' + agent.activity.text + '</span>' +
                '</div>';
        }

        var questionHTML = '';
        if (agent.question) {
            var optionBtns = agent.question.options.map(function (o) {
                return '<button class="feed-action-btn ' + o.type + '" onclick="window.agentFeed.handleAction(\'' + agent.id + '\', \'' + o.label + '\'); event.stopPropagation();">' + o.label + '</button>';
            }).join('');

            var replyHTML = '';
            if (agent.question.allowReply) {
                replyHTML = '<div class="feed-reply-row">' +
                    '<input type="text" class="feed-reply-input" placeholder="Type a response..." onclick="event.stopPropagation();" onkeydown="if(event.key===\'Enter\'){window.agentFeed.handleReply(\'' + agent.id + '\', this); event.stopPropagation();}">' +
                    '<button class="feed-reply-send" onclick="window.agentFeed.handleReply(\'' + agent.id + '\', this.previousElementSibling); event.stopPropagation();">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
                    'Send</button></div>';
            }

            questionHTML = '<div class="feed-card-question">' +
                '<div class="feed-card-question-label">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
                'Agent needs your input</div>' +
                '<div class="feed-card-question-text">' + agent.question.text + '</div>' +
                '<div class="feed-card-actions">' + optionBtns + '</div>' +
                replyHTML + '</div>';
        }

        var pauseResumeBtn = '';
        if (agent.status === 'running') {
            pauseResumeBtn = '<button class="feed-action-btn secondary" style="padding:4px 8px; font-size:11px;" onclick="window.agentFeed.handleAction(\'' + agent.id + '\', \'pause\'); event.stopPropagation();" title="Pause">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg></button>';
        } else if (agent.status === 'paused') {
            pauseResumeBtn = '<button class="feed-action-btn secondary" style="padding:4px 8px; font-size:11px;" onclick="window.agentFeed.handleAction(\'' + agent.id + '\', \'resume\'); event.stopPropagation();" title="Resume">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>';
        }

        return '<div class="' + cardClass + '" data-feed-status="' + agent.status + '" onclick="window.agentFeed.openAgent(\'' + agent.id + '\')">' +
            '<div class="feed-card-top">' +
            '<div class="feed-card-info">' +
            '<div class="feed-card-avatar ' + agent.avatar + '">' + agent.avatarLabel + '</div>' +
            '<div class="feed-card-title-row">' +
            '<div class="feed-card-goal">' + agent.goal + '</div>' +
            '<div class="feed-card-meta">' +
            '<div class="feed-status-dot ' + agent.status + '"></div>' +
            '<span class="feed-card-status ' + agent.status + '">' + agent.statusLabel + '</span>' +
            '<span class="feed-card-time">' + agent.time + '</span>' +
            '</div></div></div>' +
            '<div class="feed-card-context">' +
            '<div class="feed-card-project">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' +
            '<span class="feed-card-project-name">' + agent.projectName + '</span></div>' +
            '<div class="feed-card-git">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>' +
            '<span class="feed-card-git-branch">' + agent.branch + '</span></div>' +
            pauseResumeBtn +
            '</div></div>' +
            '<div class="feed-card-progress">' +
            '<div class="feed-progress-bar">' +
            '<div class="feed-progress-fill ' + agent.status + '" style="width: ' + agent.progress + '%"></div>' +
            '</div>' +
            '<span class="feed-progress-label">' + agent.progressSteps + '</span></div>' +
            activityHTML + questionHTML + '</div>';
    }

    function renderInto(streamEl, badgeEl, filter) {
        if (!streamEl) return;

        if (badgeEl) {
            var runCount = feedAgents.filter(function (a) { return a.status === 'running'; }).length;
            var waitCount = feedAgents.filter(function (a) { return a.status === 'waiting'; }).length;
            var parts = [];
            if (runCount > 0) parts.push(runCount + ' running');
            if (waitCount > 0) parts.push(waitCount + ' blocked');
            badgeEl.textContent = parts.join(' \u00b7 ') || 'idle';
        }

        var agents = feedAgents;
        if (filter === 'needs-input') {
            agents = feedAgents.filter(function (a) { return a.status === 'waiting'; });
        } else if (filter === 'running') {
            agents = feedAgents.filter(function (a) { return a.status === 'running'; });
        } else if (filter === 'completed') {
            agents = feedAgents.filter(function (a) { return a.status === 'completed'; });
        }

        if (agents.length === 0) {
            streamEl.innerHTML = '<div class="feed-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg><div class="feed-empty-text">No agents in this category</div></div>';
            return;
        }

        var needsInput = agents.filter(function (a) { return a.status === 'waiting'; });
        var running = agents.filter(function (a) { return a.status === 'running'; });
        var paused = agents.filter(function (a) { return a.status === 'paused'; });
        var completed = agents.filter(function (a) { return a.status === 'completed'; });
        var ordered = [].concat(needsInput, running, paused, completed);

        streamEl.innerHTML = ordered.map(buildCard).join('');
    }

    window.agentFeed = {
        _renderInto: renderInto,

        handleAction: function (agentId, action) {
            var card = document.querySelector('[data-feed-status][onclick*="' + agentId + '"]');
            if (card) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0.6';
                setTimeout(function () { card.style.opacity = '1'; }, 600);
            }
            console.log('Agent Feed action:', agentId, action);
        },

        handleReply: function (agentId, inputEl) {
            var val = inputEl.value.trim();
            if (!val) return;
            inputEl.value = '';
            var card = document.querySelector('[data-feed-status][onclick*="' + agentId + '"]');
            if (card) {
                var q = card.querySelector('.feed-card-question');
                if (q) {
                    q.innerHTML = '<div style="padding:8px 0;color:#34d399;font-size:12px;font-weight:600;">Response sent. Agent resuming...</div>';
                }
            }
            console.log('Agent Feed reply:', agentId, val);
        },

        openAgent: function (agentId) {
            window.location.href = '../tasks/index.html';
        }
    };
})();
