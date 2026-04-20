import { Migration } from '@mikro-orm/migrations';

export class Migration20260410153000_add_campaign_customization_fields extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table `newsletter_campaign` add `preheader` varchar(255) null, add `template_style` varchar(20) null, add `customization_raw` text null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `newsletter_campaign` drop column `preheader`, drop column `template_style`, drop column `customization_raw`;');
  }

}
