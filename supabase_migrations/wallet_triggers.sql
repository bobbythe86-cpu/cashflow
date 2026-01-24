-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.type = 'income') THEN
            UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.wallet_id;
        ELSIF (NEW.type = 'expense') THEN
            UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
        END IF;
        
        -- Handle internal transfers
        IF (NEW.to_wallet_id IS NOT NULL) THEN
             UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.to_wallet_id;
        END IF;
    
    -- For DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.type = 'income') THEN
            UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.wallet_id;
        ELSIF (OLD.type = 'expense') THEN
            UPDATE wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
        END IF;

        -- Handle internal transfers
        IF (OLD.to_wallet_id IS NOT NULL) THEN
             UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.to_wallet_id;
        END IF;

    -- For UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Reverse old transaction
        IF (OLD.type = 'income') THEN
            UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.wallet_id;
        ELSIF (OLD.type = 'expense') THEN
            UPDATE wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
        END IF;
        
        IF (OLD.to_wallet_id IS NOT NULL) THEN
             UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.to_wallet_id;
        END IF;

        -- Apply new transaction
        IF (NEW.type = 'income') THEN
            UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.wallet_id;
        ELSIF (NEW.type = 'expense') THEN
            UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
        END IF;

        IF (NEW.to_wallet_id IS NOT NULL) THEN
             UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.to_wallet_id;
        END IF;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for transactions
DROP TRIGGER IF EXISTS on_transaction_change ON transactions;
CREATE TRIGGER on_transaction_change
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();
