import Stack from '@mui/material/Stack';
import Button, { type ButtonProps } from '@mui/material/Button';

interface AppButtonProps extends ButtonProps {
  stackSpacing?: number;
}

export default function AppButton({ children, stackSpacing = 2, ...props }: AppButtonProps) {
  return (
    <Stack spacing={stackSpacing} direction="row">
      <Button {...props}>
        {children}
      </Button>
    </Stack>
  );
}