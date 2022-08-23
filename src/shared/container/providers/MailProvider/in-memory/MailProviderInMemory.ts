import { IMailProvider } from '../IMailProvider';

class MailProviderInMemory implements IMailProvider {
    private message: any;

    async sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string,
    ): Promise<void> {
        this.message = {
            to,
            subject,
            variables,
            path,
        };
    }
}

export { MailProviderInMemory };
