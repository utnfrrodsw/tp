import { useDefaultScroll } from "../../../libs/globalFunctions.tsx";
import './Terms.css';

export function Terms() {
    useDefaultScroll()
    return(
        <>
        <div className="terms-container">
            <h1 className="terms-title"> Terms and Conditions of UTimbaN </h1>
            <p> Last Updated: 08/09/2024, Version: 1.0.0 </p>
            <div className="terms-data"> 
                <p> Welcome to UTimbaN. By using our website, you agree to adhere to the following terms and conditions. <strong>If you do not agree with any of these terms, we ask that you do not use our service.</strong> </p>
                <h2 className="sub-title p-bottom"> Acceptance of Terms </h2>
                <p> By registering and using UTimbaN, you agree to be legally responsible for complying with these terms and conditions.</p>
                <h2 className="sub-title"> Age Requirements </h2>
                <p> UTimbaN is intended solely for users who are 18 years of age or older. By registering, you confirm that you are at least 18 years old. </p>
                <h2 className="sub-title"> User Registration </h2>
                <p> To use our services, you must create an account by providing the following information: <br/>
                - Username <br/>
                - Email address <br/>
                - Password <br />
                - Date of birth <br />
                - Age <br />
                - Phone number <br />
                - Address <br />
                You are responsible for maintaining the confidentiality of your login information, including your password. </p>
                <h2 className="sub-title"> Payment Information </h2>
                <p> UTimbaN accepts payments via credit and debit card. By providing payment information, you assure that you are the legitimate owner of the card and that you are authorized to use it. We are committed to protecting your card information and will use it only as necessary to process your transactions. </p>
                <h2 className="sub-title"> Jurisdiction </h2>
                <p> UTimbaN is intended for users in South American countries. It is your responsibility to ensure that your use of our services complies with the laws of your country. </p>
                <h2 className="sub-title"> Changes to Terms </h2>
                <p> UTimbaN reserves the right to modify these terms and conditions at any time. Changes will be posted on this page, and if you continue to use our services after the changes are posted, you agree to be bound by the new terms. </p>
                <h2 className="sub-title"> Contact </h2>
                <p> If you have any questions regarding these terms, you may contact us at [contact email] or [contact phone number]. </p>
                <h2 className="sub-title"> Acceptance of Risk </h2>
                <p> You acknowledge that gambling carries financial risks and that you are responsible for managing your time and spending while using the service. </p>
            </div>
        </div>
        </>
    )
}