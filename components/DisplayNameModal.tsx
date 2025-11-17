import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AccessibleModal from './ui/AccessibleModal';
import CharacterCounter from './ui/CharacterCounter';
import ValidationFeedback from './ui/ValidationFeedback';

interface DisplayNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (displayName: string) => void;
  currentDisplayName: string;
  defaultName: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{ $hasError: boolean }>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.base};
  transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? `${theme.colors.error}20` : `${theme.colors.accent}20`
    };
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputMetadata = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 20px;
`;

const HelperText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.xs};
`;

const InfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary}08;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const InfoText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium
  };
  line-height: ${({ theme }) => theme.typography.lineHeight.base};
  cursor: pointer;
  transition: all 150ms ease-in-out;
  border: none;

  ${({ theme, $variant }) => 
    $variant === 'primary' ? `
      background-color: ${theme.colors.accent};
      color: white;
      box-shadow: ${theme.shadows.sm};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.accentDark};
        box-shadow: ${theme.shadows.md};
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.accent};
        outline-offset: 2px;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    ` : `
      background-color: ${theme.colors.surfaceLight};
      color: ${theme.colors.text};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.background};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.accent};
        outline-offset: 2px;
      }
    `
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MAX_LENGTH = 50;
const MIN_LENGTH = 2;

function DisplayNameModal({ isOpen, onClose, onSave, currentDisplayName, defaultName }: DisplayNameModalProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName || defaultName);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentDisplayName || defaultName);
      setTouched(false);
    }
  }, [isOpen, currentDisplayName, defaultName]);

  const trimmedName = displayName.trim();
  const isValid = trimmedName.length >= MIN_LENGTH && trimmedName.length <= MAX_LENGTH;
  const showValidation = touched && trimmedName.length > 0;

  const getValidationMessage = () => {
    if (trimmedName.length < MIN_LENGTH) {
      return `Name must be at least ${MIN_LENGTH} characters`;
    }
    if (trimmedName.length > MAX_LENGTH) {
      return `Name cannot exceed ${MAX_LENGTH} characters`;
    }
    return 'Looks good!';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    if (isValid) {
      onSave(trimmedName);
      onClose();
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleCancel = () => {
    setDisplayName(currentDisplayName || defaultName);
    setTouched(false);
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Display Name"
      size="md"
      closeOnOverlayClick={false}
      ariaDescribedBy="display-name-description"
    >
      <Form onSubmit={handleSubmit}>
        <InfoBox>
          <InfoIcon aria-hidden="true">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </InfoIcon>
          <InfoText id="display-name-description">
            Choose a display name that will appear with your messages in the chat. Make it memorable and appropriate!
          </InfoText>
        </InfoBox>

        <FormGroup>
          <Label htmlFor="displayName">Your Display Name</Label>
          <InputWrapper>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter display name..."
              maxLength={MAX_LENGTH}
              $hasError={showValidation && !isValid}
              autoComplete="off"
              aria-describedby="display-name-helper display-name-validation"
              aria-invalid={showValidation && !isValid}
              required
            />
          </InputWrapper>
          <InputMetadata>
            <div style={{ flex: 1 }}>
              <ValidationFeedback
                isValid={isValid}
                message={getValidationMessage()}
                show={showValidation}
              />
              {!showValidation && (
                <HelperText id="display-name-helper">
                  {MIN_LENGTH}-{MAX_LENGTH} characters
                </HelperText>
              )}
            </div>
            <CharacterCounter current={displayName.length} max={MAX_LENGTH} />
          </InputMetadata>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={handleCancel} $variant="secondary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            $variant="primary"
            disabled={!isValid && touched}
          >
            Save Display Name
          </Button>
        </ButtonGroup>
      </Form>
    </AccessibleModal>
  );
}

export default DisplayNameModal;
