import { Migration } from '@mikro-orm/migrations';

export class Migration20260410190000_update_newsletter_campaign_created_at_to_datetime extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table `newsletter_campaign` modify `created_at` datetime not null default current_timestamp;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `newsletter_campaign` modify `created_at` date not null;');
  }

}
