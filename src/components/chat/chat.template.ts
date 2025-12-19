export default `
            {{{addUserModal}}}
            {{{deleteUserModal}}}
            
            <header class="chat__header">
                <div class="chat__avatar"></div>
                <div class="chat__info">
                    <span class="chat__name">{{chat.title}}</span>
                </div>
                <div class="chat__menu-wrapper">
                    {{{contextMenuButton}}}
                    {{{contextMenu}}}
                </div>
            </header>

            <section class="chat__messages">
                {{#each chat.messages}}
                <div class="chat__message {{#if isFromMe}}chat__message--from-me{{/if}}">
                    <div class="chat__message-content">
                        <p class="chat__message-text">{{content}}</p>
                        <div class="chat__message-footer">
                            {{#if isFromMe}}
                            {{#if isRead}}
                            <span class="chat__message-status chat__message-status--read"></span>
                            {{else}}
                            <span class="chat__message-status chat__message-status--unread"></span>
                            {{/if}}
                            {{/if}}
                            <span class="chat__message-time">{{time}}</span>
                        </div>
                    </div>
                </div>
                {{#if showDate}}
                <div class="chat__message-date">{{date}}</div>
                {{/if}}
                {{/each}}
            </section>
            <footer class="chat__message-block">
                {{{messageForm}}}
            </footer>
`;