import { html, css, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';

@customElement('two-factor')
export class TwoFactorElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;

      margin-bottom: 1rem;
    }

    input {
      border: 2px solid black;
      font-size: 6rem;
      font-weight: bold;
      text-align: center;
      margin:0.25rem;
      width:5rem;
    }

    /* TODO: Feels hacky (any nicer ideas) */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      display:none;
    }
  `;

  /**
   * The number of input fields to display
   * Defaults to 6 input fields, common for 2FA codes
   */
  @property({ type: Number })
  items = 6;

  @queryAll('input')
  _inputs!: NodeListOf<HTMLInputElement>;

  inputHandler(e: Event) {
    const currentInputElement = e.target as HTMLInputElement;

    const val = currentInputElement.value;
    console.log('val', val);

    // TODO: Pasting values from clipboard
    // Does not work and only puts first number into input
    // TRY THIS ?
    // https://stackoverflow.com/questions/60939532/paste-code-from-clipboard-in-multiple-input-fields
    // https://stackoverflow.com/questions/11804064/pasting-multiple-numbers-over-multiple-input-fields

    // Find index of input event in inputs collection
    let index = -100;
    this._inputs.forEach((input, i) => {
      if (input === currentInputElement) {
        // TODO: No way to break out of forEach loop
        index = i;
      }
    });

    // TODO: Logic if value in textbox is emptied out [Used backspace/delete key]
    // Goto previous input field and focus that (only if we not at first position)

    // Only focus to next input if less than total inputs
    // Remember length is 1 based where our index is 0 based
    if (index < this._inputs.length - 1) {
      const nextInput = this._inputs.item(index + 1);
      nextInput.focus();
    } else {
      // Only fire in last item (ensure we fire only ONCE)
      // Fire new event to SUBMIT a form with the values
    }
  }

  render() {
    const itemTemplates = [];
    for (let i = 0; i < this.items; i++) {
      itemTemplates.push(
        html`<input type="number" size="1" min="0" max="9" placeholder="${
          i + 1
        }" @input="${this.inputHandler}" />`
      );
    }

    return html`
      ${itemTemplates}
      <!-- TODO: Maybe remove slot -->
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'two-factor': TwoFactorElement;
  }
}

// ** Logic **
// Paste values from clipboard
// What do we do when the clipboard is not numbers ?
// Last number entered from paste submits form (fire custom event)

// Typing one number at a time
// Move to next input field
// When deleting a number
// Move backwards to previous field

// TODO:
// HTML number input does not limit to one number even with min & max
// If we use text input (no CSS hack for spinner hide) we need to check ourselves for digits only
