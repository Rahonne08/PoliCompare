'use client';

import * as React from 'react';
import { Search, User, X, Loader2 } from 'lucide-react';
import { Politician, searchPoliticians } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface PoliticianSearchProps {
  onSelect?: (politician: Politician) => void;
  placeholder?: string;
  className?: string;
}

export function PoliticianSearch({ onSelect, placeholder = "Buscar político...", className }: PoliticianSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Politician[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setLoading(true);
        try {
          const data = await searchPoliticians(query);
          setResults(data);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (p: Politician) => {
    setOpen(false);
    if (onSelect) {
      onSelect(p);
    } else {
      router.push(`/politician/${p.id}`);
    }
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start text-muted-foreground font-normal h-12 px-4 rounded-xl border-2 hover:border-primary/50 transition-all"
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Digite o nome, partido ou estado..." 
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {loading && (
                <div className="p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground animate-in fade-in duration-300">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Buscando políticos...</p>
                </div>
              )}
              {!loading && query.length > 0 && query.length < 3 && (
                <div className="p-4 text-center text-sm text-muted-foreground">Digite pelo menos 3 caracteres</div>
              )}
              {!loading && query.length >= 3 && results.length === 0 && (
                <CommandEmpty>Nenhum político encontrado.</CommandEmpty>
              )}
              <CommandGroup>
                {results.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.id}
                    onSelect={() => handleSelect(p)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={p.photoUrl} alt={p.name} />
                      <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm leading-none mb-1">{p.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1 uppercase">{p.party}</Badge>
                        <span className="text-xs text-muted-foreground">{p.state} • {p.type === 'deputado' ? 'Deputado' : 'Senador'}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
