import { Link, LinkProps } from '@tanstack/react-router';
import { Button } from './button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export function GoBack(props: LinkProps) {
  return (
    <Link {...props} className={cn('w-fit', props.className)}>
      <Button className="size-10 rounded-full p-1">
        <ChevronLeft className="text-white" />
      </Button>
    </Link>
  );
}
