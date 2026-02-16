// Version: 0.1.1
import { css } from "https://unpkg.com/lit@2.8.0/index.js?module";

export const schedulerSharedStyles = css`
  ha-card {
    padding: 4px;
  }

  .title {
    margin-bottom: 16px;
    font-size: 1.4rem;
  }

  .plan {
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 16px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    transition: all 0.2s ease;
  }

  .plan:hover {
    border-color: var(--primary-color);
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 500;
  }

  ha-icon-button.delete-btn ha-icon {
    color: var(--primary-color);
  }

  .info {
    padding: 16px;
    opacity: 0.7;
  }

  .add-btn {
    width: 100%;
    margin-top: 16px;
    background: var(--primary-color);
    color: #fff;
    font-weight: bold;
    font-size: 1.1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 0;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  .add-btn:hover {
    background: var(--success-color, #2e7d32);
  }
`;
