import { Migration } from '@mikro-orm/migrations';

export class Migration20260410123000_add_newsletter_campaign_history extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table `newsletter_campaign` (`id` int unsigned not null auto_increment primary key, `subject` varchar(255) not null, `message` text not null, `audience` varchar(20) not null, `total_recipients` int not null default 0, `sent` int not null default 0, `failed` int not null default 0, `failed_recipients_raw` text null, `sent_by_user_id` int null, `sent_by_email` varchar(255) null, `is_test` tinyint(1) not null default false, `created_at` date not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('create index `newsletter_campaign_created_at_index` on `newsletter_campaign` (`created_at`);');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists `newsletter_campaign`;');
  }

}
