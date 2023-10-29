import { Notify } from 'quasar';
import { removeSpecialCharacters } from 'src/utils/string.utils';
import { ERROR_NETWORK_REDIRECT } from 'src/services/utils/utils';

export function errorRequestNotificationUtil(error: any) {
  if (error?.response) {
    const fieldErrors = error?.response?.data?.errors[0];

    if (fieldErrors) {
      let listErrors = '';

      listErrors = `${removeSpecialCharacters(fieldErrors.dataPath)}: `;
      listErrors += fieldErrors.message;

      Notify.create({
        message: listErrors,
        color: 'negative',
        icon: 'report_problem',
      });
    } else {
      Notify.create({
        message: error?.response?.data?.message,
        color: 'negative',
        icon: 'report_problem',
      });
    }
  }

  if (error.code === 'ERR_NETWORK') {
    Notify.create({
      message: error?.message,
      color: 'negative',
      icon: 'report_problem',
    });
    ERROR_NETWORK_REDIRECT();
  } else if (error.code === 'ECONNABORTED') {
    Notify.create({
      message: 'Tempo de conexão excedido',
      color: 'negative',
      icon: 'report_problem',
    });
  }

  // TODO tratar exception e colocar mais code erros...
}
