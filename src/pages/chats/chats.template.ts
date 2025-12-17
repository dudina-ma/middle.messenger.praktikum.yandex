export default `
        {{{createChatModal}}}
        {{{addUserModal}}}
        <section class="chats-page__sidebar">
            <header class="chats-page__header">
                {{{profileLink}}}
                <search class="chats-page__search-box">
                    {{{searchForm}}}
                </search>
                {{{createChatButton}}}
            </header>

            <section class="chats-page__chat-list">
                <ul>
                    {{#each chatList}}
                        {{{this}}}
                    {{/each}}
                </ul>
            </section>
        </section>

        <section class="chats-page__dialog">
            <header class="chats-page__dialog-header">
                <div class="chats-page__dialog-avatar"></div>
                <div class="chats-page__dialog-info">
                    <span class="chats-page__dialog-name">{{dialog.name}}</span>
                </div>
                <div class="chats-page__dialog-menu-wrapper">
                    {{{dialogMenuButton}}}
                    <div class="chats-page__context-menu">
                        {{{addUserButton}}}
                        {{{deleteUserButton}}}
                    </div>
                </div>
            </header>

            <section class="chats-page__messages">
                {{#each dialog.messages}}
                <div class="chats-page__message {{#if isFromMe}}chats-page__message--from-me{{/if}}">
                    <div class="chats-page__message-content">
                        <p class="chats-page__message-text">{{content}}</p>
                        <div class="chats-page__message-footer">
                            {{#if isFromMe}}
                            {{#if isRead}}
                            <span class="chats-page__message-status chats-page__message-status--read"></span>
                            {{else}}
                            <span class="chats-page__message-status chats-page__message-status--unread"></span>
                            {{/if}}
                            {{/if}}
                            <span class="chats-page__message-time">{{time}}</span>
                        </div>
                    </div>
                </div>
                {{#if showDate}}
                <div class="chats-page__message-date">{{date}}</div>
                {{/if}}
                {{/each}}
            </section>

            <footer class="chats-page__message-block">
                {{{messageForm}}}
            </footer>
        </section>
    `;
