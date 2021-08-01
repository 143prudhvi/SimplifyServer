import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SlipComponentsPage, SlipDeleteDialog, SlipUpdatePage } from './slip.page-object';

const expect = chai.expect;

describe('Slip e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let slipComponentsPage: SlipComponentsPage;
  let slipUpdatePage: SlipUpdatePage;
  let slipDeleteDialog: SlipDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Slips', async () => {
    await navBarPage.goToEntity('slip');
    slipComponentsPage = new SlipComponentsPage();
    await browser.wait(ec.visibilityOf(slipComponentsPage.title), 5000);
    expect(await slipComponentsPage.getTitle()).to.eq('Slips');
    await browser.wait(ec.or(ec.visibilityOf(slipComponentsPage.entities), ec.visibilityOf(slipComponentsPage.noResult)), 1000);
  });

  it('should load create Slip page', async () => {
    await slipComponentsPage.clickOnCreateButton();
    slipUpdatePage = new SlipUpdatePage();
    expect(await slipUpdatePage.getPageTitle()).to.eq('Create or edit a Slip');
    await slipUpdatePage.cancel();
  });

  it('should create and save Slips', async () => {
    const nbButtonsBeforeCreate = await slipComponentsPage.countDeleteButtons();

    await slipComponentsPage.clickOnCreateButton();

    await promise.all([
      slipUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      slipUpdatePage.setTbgrInput('5'),
      slipUpdatePage.setGradeInput('grade'),
      slipUpdatePage.setLotnoInput('5'),
      slipUpdatePage.setWeightInput('5'),
      slipUpdatePage.setPriceInput('5'),
    ]);

    await slipUpdatePage.save();
    expect(await slipUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await slipComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Slip', async () => {
    const nbButtonsBeforeDelete = await slipComponentsPage.countDeleteButtons();
    await slipComponentsPage.clickOnLastDeleteButton();

    slipDeleteDialog = new SlipDeleteDialog();
    expect(await slipDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Slip?');
    await slipDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(slipComponentsPage.title), 5000);

    expect(await slipComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
