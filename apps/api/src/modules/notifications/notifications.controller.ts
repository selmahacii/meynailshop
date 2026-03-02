import { Controller, Get, Post, Body, Param, UseGuards, Delete, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/database/entities/user.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@CurrentUser() user: User) {
    return {
      statusCode: 200,
      message: 'Notifications retrieved',
      data: await this.notificationsService.getNotifications(user.id),
    };
  }

  @Get('unread')
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return {
      statusCode: 200,
      message: 'Unread count retrieved',
      data: { unreadCount: count },
    };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string, @CurrentUser() user: User) {
    await this.notificationsService.markAsRead(notificationId, user.id);
    return {
      statusCode: 200,
      message: 'Notification marked as read',
      data: null,
    };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') notificationId: string, @CurrentUser() user: User) {
    await this.notificationsService.deleteNotification(notificationId, user.id);
    return {
      statusCode: 200,
      message: 'Notification deleted',
      data: null,
    };
  }

  @Post('read-all')
  async markAllAsRead(@CurrentUser() user: User) {
    await this.notificationsService.markAllAsRead(user.id);
    return {
      statusCode: 200,
      message: 'All notifications marked as read',
      data: null,
    };
  }
}
