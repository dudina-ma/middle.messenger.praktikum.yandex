export default `
    {{#if icon}}
      <span class="{{iconClass}}"></span>
    {{/if}}
    {{#if text}}
      {{text}}
    {{/if}}
    {{#if children}}
      {{#each children}}
        {{{this}}}
      {{/each}}
    {{/if}}
`;