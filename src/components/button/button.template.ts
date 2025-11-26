export default `
  <button 
    type="{{type}}" 
    {{#if attr.class}}class="{{attr.class}}"{{/if}}
    {{#if disabled}}disabled{{/if}}
  >
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
  </button>
`;