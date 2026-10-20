import {
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  Building2,
  Clock,
  Database,
  FilePen,
  FileText,
  Gavel,
  HeartPulse,
  type IconComponent,
  Landmark,
  Layers,
  LogOut,
  Network,
  QrCode,
  RefreshCw,
  Scale,
  ShieldCheck,
  User,
  Wallet,
} from '@/shared/ui/icon';

const CONTENT_ICONS: Record<string, IconComponent> = {
  'arrow-left-right': ArrowLeftRight,
  'book-open': BookOpen,
  briefcase: Briefcase,
  'building-2': Building2,
  clock: Clock,
  database: Database,
  'file-pen': FilePen,
  'file-text': FileText,
  gavel: Gavel,
  'heart-pulse': HeartPulse,
  landmark: Landmark,
  layers: Layers,
  'log-out': LogOut,
  network: Network,
  'qr-code': QrCode,
  'refresh-cw': RefreshCw,
  scale: Scale,
  'shield-check': ShieldCheck,
  user: User,
  wallet: Wallet,
};

type ContentIconProps = Readonly<{
  name: string | undefined;
}>;

export function ContentIcon({ name }: ContentIconProps) {
  const Icon = (name === undefined ? undefined : CONTENT_ICONS[name]) ?? FileText;
  return <Icon aria-hidden="true" />;
}
