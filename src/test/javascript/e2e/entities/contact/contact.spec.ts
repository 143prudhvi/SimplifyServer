import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ContactComponentsPage, ContactDeleteDialog, ContactUpdatePage } from './contact.page-object';

const expect = chai.expect;

describe('Contact e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let contactComponentsPage: ContactComponentsPage;
  let contactUpdatePage: ContactUpdatePage;
  let contactDeleteDialog: ContactDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Contacts', async () => {
    await navBarPage.goToEntity('contact');
    contactComponentsPage = new ContactComponentsPage();
    await browser.wait(ec.visibilityOf(contactComponentsPage.title), 5000);
    expect(await contactComponentsPage.getTitle()).to.eq('Contacts');
    await browser.wait(ec.or(ec.visibilityOf(contactComponentsPage.entities), ec.visibilityOf(contactComponentsPage.noResult)), 1000);
  });

  it('should load create Contact page', async () => {
    await contactComponentsPage.clickOnCreateButton();
    contactUpdatePage = new ContactUpdatePage();
    expect(await contactUpdatePage.getPageTitle()).to.eq('Create or edit a Contact');
    await contactUpdatePage.cancel();
  });

  it('should create and save Contacts', async () => {
    const nbButtonsBeforeCreate = await contactComponentsPage.countDeleteButtons();

    await contactComponentsPage.clickOnCreateButton();

    await promise.all([contactUpdatePage.setNameInput('name'), contactUpdatePage.setPhoneInput('5')]);

    await contactUpdatePage.save();
    expect(await contactUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await contactComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Contact', async () => {
    const nbButtonsBeforeDelete = await contactComponentsPage.countDeleteButtons();
    await contactComponentsPage.clickOnLastDeleteButton();

    contactDeleteDialog = new ContactDeleteDialog();
    expect(await contactDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Contact?');
    await contactDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(contactComponentsPage.title), 5000);

    expect(await contactComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
