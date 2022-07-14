import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { BillingInfoModule } from './billing-info/billing-info.module';
import { OrdersModule } from './orders/orders.module';
import { ResponsibilityModule } from './responsbilities/responsibilies.module';
import { ServicesModule } from './services/services.module';
import { DeliveryPlansModule } from './delivery-plans/delivery-plans.module';
import { OptionalServicesModule } from './optional-services/optional-services.module';
import { EditableSectionsModule } from './editable-sections/editable-sections.module';
import { ProjectManagementModule } from './projects/project-management.module';
import { TaskModule } from './task/task.module';
import { FileModule } from './file/file.module';
import { DiscountCouponModule } from './discount-coupon/discount-coupon.module';
import { S3UploaderModule } from './s3-uploader/s3-uploader.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { ZipCodesModule } from './zip-codes/zip-codes.module';
import { DeliverablesModule } from './deliverables/deliverables.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessageModule } from './message/message.module';
import ormConfig from './CONFIG/orm.config';
import ormConfigProd from './CONFIG/orm.config.prod';
import { AssistanceServicesModule } from './assistance-services/assistance-services.module';
import { AssistanceRequestsModule } from './assistance-requests/assistance-requests.module';
import { ReviewOrdersModule } from './review-orders/review-orders.module';
import { ClientsModule } from './clients/clients.module';
import { NewFolderModule } from './new-folder/new-folder.module';
import { TeamMemberModule } from './team-member/team-member.module';
import { ProfileDataModule } from './profile-data/profile-data.module';
import * as Joi from 'joi';
import { TicketModule } from './ticket/ticket.module';
import { OrderDeliverablesModule } from './order-deliverables/order-deliverables.module';
import { ContractorTracksModule } from './contractor-tracks/contractor-tracks.module';
import { EmployeeModule } from './employee/employee.module';
import { TerminateModule } from './terminate/terminate.module';
import { ResignationModule } from './resignation-form/resignation.module';
import { PayrollModule } from './payroll/payroll.module';
import { BenefitsModule } from './benefits/benefits.module';
import { DeductionsModule } from './deductions/deductions.module';
import { TaskSettingsModule } from './task-settings/task-settings.module';
import { InhouseModule } from './inhouse/inhouse.module';
import { ContractorModule } from './contractor/contractor.module';
import { DepartmentModule } from './department/department.module';
import { ProjectClosureModule } from './project-closure/project-closure.module';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { EditorModule } from './editor/editor.module';
import { TeamSummaryModule } from './team-summary/team-summary.module';
import { EmployeeWorkModule } from './employee-work/employee-work.module';
import { ClientManagerModule } from './client-manager/client-manager.module';
import { AvailabilityModule } from './availability/availability.module';
import { PayrollTeamsummaryModule } from './payroll-teamsummary/payroll-teamsummary.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EditingServicesModule } from './editing-services/editing-services.module';
import { TranslationServicesModule } from './translation-services/translation-services.module';
import { PublicationServicesModule } from './publication-services/publication-services.module';
import { PresentationServicesModule } from './presentation-services/presentation-services.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { EmailGroupModule } from './email-group/email-group.module';
import { RequestClosureModule } from './request-closure/request-closure.module';
import { CustomPackModule } from './custom-pack/custom-pack.module';
import { ProjectReopenModule } from './project-reopen/project-reopen.module';
import { GlobalSearchModule } from './global-search/global-search.module';
import { EmailSchedulingModule } from './email-schedule/email-schedule.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        MONGO_URL: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        SENDGRID_API_KEY: Joi.string().required(),
        SENDGRID_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'development' ? ormConfigProd : ormConfig,
    }),
    ServicesModule,
    RolesModule,
    UsersModule,
    BillingInfoModule,
    ResignationModule,
    OrdersModule,
    ResponsibilityModule,
    ServicesModule,
    TerminateModule,
    DeliveryPlansModule,
    OptionalServicesModule,
    EditableSectionsModule,
    ProjectManagementModule,
    TaskModule,
    BenefitsModule,
    FileModule,
    S3UploaderModule,
    DiscountCouponModule,
    PayrollModule,
    MailModule,
    ZipCodesModule,
    ProjectClosureModule,
    DeliverablesModule,
    AssistanceServicesModule,
    AssistanceRequestsModule,
    NotificationsModule,
    MessageModule,
    ReviewOrdersModule,
    ClientsModule,
    NewFolderModule,
    TeamMemberModule,
    ProfileDataModule,
    TicketModule,
    OrderDeliverablesModule,
    EmployeeModule,
    TerminateModule,
    PayrollModule,
    DeductionsModule,
    TaskSettingsModule,
    InhouseModule,
    ContractorModule,
    DepartmentModule,
    ProjectClosureModule,
    EmailModule,
    AdminModule,
    TimesheetModule,
    EditorModule,
    ContractorTracksModule,
    TeamSummaryModule,
    EmployeeWorkModule,
    ClientManagerModule,
    AvailabilityModule,
    PayrollTeamsummaryModule,
    DashboardModule,
    EditingServicesModule,
    TranslationServicesModule,
    PublicationServicesModule,
    PresentationServicesModule,
    EmailTemplateModule,
    EmailGroupModule,
    RequestClosureModule,
    CustomPackModule,
    ProjectReopenModule,
    GlobalSearchModule,
    EmailSchedulingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
