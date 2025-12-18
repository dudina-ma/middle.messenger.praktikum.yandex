export default `
        {{{createChatModal}}}
        {{{addUserModal}}}
        {{{deleteUserModal}}}
        
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

        {{{chat}}}
    `;
