// Version: 0.1.1
// Zentrale Style-Konstanten für Card-Mod Styling

export const DROPDOWN_STYLE = `
  ha-card {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }

  .row .icon {
    margin-left: -16px !important;
  }

  .row .name {
    margin-left: -8px !important;
  }

  .row .value {
    border-radius: 12px !important;
  }
`;

export const TIME_SPINNER_STYLE = `
  ha-card {
    box-shadow: none !important;
    border: none !important;
    padding: 0px !important;
    margin: 0px 0px 0px -8px;
  }

  .name {
    margin-inline-start: -4px !important;
  }

  button span {
    display: none;
  }

  .time-btn {
    min-height: 40px !important;
    height: 40px !important;
    padding: 0px 0px 0px !important;
    border-radius: 12px !important;
    overflow: hidden;
  }
`;

export const TILE_SOC_STYLE = `
  ha-card {
    background: none;
    border: none;
    box-shadow: none;
    border: none;
  }

  hui-card-features$ hui-card-feature$ 
  hui-numeric-input-card-feature$ 
  ha-control-slider$ .slider {
    height: 35px !important;
    --control-slider-color: var(--primary-color) !important;
    --control-slider-background: var(--primary-color) !important;
    --control-slider-background-opacity: 0.25;
  }
`;

export const TILE_SWITCH_STYLE = `
  ha-state-icon {
    color: #44739E;
  }

  ha-card {
    background: none;
    border: none;
    box-shadow: none;
    border: none;
  }
`;
