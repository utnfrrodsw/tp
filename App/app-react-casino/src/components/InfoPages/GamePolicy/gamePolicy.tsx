import { defaultScroll } from "../../../libs/globalFunctions.tsx";
import './gamePolicy.css';

export function GamePolicy() {
    defaultScroll()
      
    return (
        <div className="gp-container"> 
            <h1 className="gp-title">Game Policy of UTimbaN</h1>
            <p>Last Updated: 08/11/2024, Version: 1.0.0</p>
            <div className="gp-data"> 
                <h2 className="sub-title">Acceptance</h2>
                <p>This Policy explains the rules, settings and conditions of all Games and gambling Services on the Website. The usage is only possible when fully agreeing to the Company's terms. Definitions:</p>
                <h2 className="sub-title">Definitions</h2>
                <p>
                    - Account or User Account: refers to your User Account created on UTimbaN.<br />
                    - Bet and Wager: refer to every participation in any Game on the Website.<br />
                    - Company, We or US refers to Maggineta S.A ("UTimbaN").<br />
                    - Game and Games: refers to any gambling Services on the Website, including Games of skill, Games of chance, Games of risk and sports Bets, and esports.<br />
                    - Maggicoints: refers to your on-site wallet where your funds are stored.<br />
                    - Spin: refers to a free spin on a Roobet Slot.<br />
                    - Reward: Refers to all Bonuses, Promotions, Rakeback, RooSpins, Rain and other free funds given out by the Company.<br />
                    - Service and Services: refer to all Games, chat rooms and support interactions, and features such as deposits, tips, withdraws and bonuses available on the Website or associated with it.<br />
                    - Terms: refers to this agreement which is made up of the Terms of Service, Privacy Policy, AML Policy, Responsible Gambling Policy, Bonus and Promotion Policy, Game and Sportsbook Policy.<br />
                    - You, User or Player: refers to each natural individual with an Account at UTimbaN.
                </p>
            </div>
        </div>
    );
}
