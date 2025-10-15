import {
  CalendarProvider,
  Event,
} from '../../domain/services/NotificationService';
import { NativeModules } from 'react-native';

export class AndroidCalendarProvider implements CalendarProvider {
  createEvent(event: Event) {
    const { CalendarModule } = NativeModules;
    CalendarModule.createEvent(
      event.title,
      event.description,
      event.start.getTime(),
    );
  }
}
