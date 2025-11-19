export default `<div class="input-field">
  {{#if label}}
    <label for="{{name}}" class="input-field__label">{{label}}</label>
  {{/if}}
  
  <input 
    type="{{type}}" 
    id="{{name}}"
    name="{{name}}" 
    class="input-field__input{{#if error}} input-field__input--error{{/if}}{{#if readonly}} input-field__input--readonly{{/if}}"
    {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
    {{#if value}}value="{{value}}"{{/if}}
    {{#if readonly}}readonly{{/if}}
    {{#if required}}required{{/if}}
  >
  
  {{#if error}}
    <div class="input-field__error">{{errorText}}</div>
  {{/if}}
</div>`;
