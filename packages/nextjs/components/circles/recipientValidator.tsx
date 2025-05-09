import { FC } from "react";

interface RecipientValidatorProps {
  recipient: string;
  setRecipient: (value: string) => void;
  recipientIsValid: boolean;
  setRecipientIsValid: (value: boolean) => void;
}

const validateRecipient = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const RecipientValidator: FC<RecipientValidatorProps> = ({
  recipient,
  setRecipient,
  recipientIsValid,
  setRecipientIsValid,
}) => {
  const handleValidateRecipient = () => {
    const isValid = validateRecipient(recipient);
    setRecipientIsValid(isValid);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="recipient" className="block text-sm font-medium">
        Recipient Address
      </label>
      <input
        id="recipient"
        type="text"
        placeholder="Enter recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        onBlur={handleValidateRecipient}
        className="input input-bordered w-full"
      />
      {!recipientIsValid && recipient && (
        <p className="text-error text-sm">Please enter a valid recipient address</p>
      )}
    </div>
  );
};

export default RecipientValidator;