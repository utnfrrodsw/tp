import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class NewsletterCampaign {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  subject!: string;

  @Property({ type: 'text' })
  message!: string;

  @Property({ nullable: true })
  preheader?: string | null;

  @Property({ nullable: true, length: 20 })
  templateStyle?: string | null;

  @Property({ length: 20 })
  audience!: 'registered' | 'subscribers' | 'all' | 'test';

  @Property()
  totalRecipients: number = 0;

  @Property()
  sent: number = 0;

  @Property()
  failed: number = 0;

  @Property({ type: 'text', nullable: true })
  failedRecipientsRaw?: string;

  @Property({ type: 'text', nullable: true })
  customizationRaw?: string | null;

  @Property({ nullable: true })
  sentByUserId?: number | null;

  @Property({ nullable: true })
  sentByEmail?: string | null;

  @Property({ default: false })
  isTest: boolean = false;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  createdAt: Date = new Date();

  get failedRecipients(): string[] {
    if (!this.failedRecipientsRaw) return [];
    try {
      const parsed = JSON.parse(this.failedRecipientsRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  set failedRecipients(value: string[]) {
    this.failedRecipientsRaw = JSON.stringify(Array.isArray(value) ? value : []);
  }

  get customization(): Record<string, any> | null {
    if (!this.customizationRaw) return null;
    try {
      return JSON.parse(this.customizationRaw);
    } catch {
      return null;
    }
  }

  set customization(value: Record<string, any> | null) {
    this.customizationRaw = value ? JSON.stringify(value) : null;
  }
}
