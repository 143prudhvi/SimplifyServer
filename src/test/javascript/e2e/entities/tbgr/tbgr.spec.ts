import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TbgrComponentsPage, TbgrDeleteDialog, TbgrUpdatePage } from './tbgr.page-object';

const expect = chai.expect;

describe('Tbgr e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let tbgrComponentsPage: TbgrComponentsPage;
  let tbgrUpdatePage: TbgrUpdatePage;
  let tbgrDeleteDialog: TbgrDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Tbgrs', async () => {
    await navBarPage.goToEntity('tbgr');
    tbgrComponentsPage = new TbgrComponentsPage();
    await browser.wait(ec.visibilityOf(tbgrComponentsPage.title), 5000);
    expect(await tbgrComponentsPage.getTitle()).to.eq('Tbgrs');
    await browser.wait(ec.or(ec.visibilityOf(tbgrComponentsPage.entities), ec.visibilityOf(tbgrComponentsPage.noResult)), 1000);
  });

  it('should load create Tbgr page', async () => {
    await tbgrComponentsPage.clickOnCreateButton();
    tbgrUpdatePage = new TbgrUpdatePage();
    expect(await tbgrUpdatePage.getPageTitle()).to.eq('Create or edit a Tbgr');
    await tbgrUpdatePage.cancel();
  });

  it('should create and save Tbgrs', async () => {
    const nbButtonsBeforeCreate = await tbgrComponentsPage.countDeleteButtons();

    await tbgrComponentsPage.clickOnCreateButton();

    await promise.all([
      tbgrUpdatePage.setBoardInput('board'),
      tbgrUpdatePage.setVillageInput('village'),
      tbgrUpdatePage.setTbgrInput('5'),
      tbgrUpdatePage.setNameInput('name'),
    ]);

    await tbgrUpdatePage.save();
    expect(await tbgrUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await tbgrComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Tbgr', async () => {
    const nbButtonsBeforeDelete = await tbgrComponentsPage.countDeleteButtons();
    await tbgrComponentsPage.clickOnLastDeleteButton();

    tbgrDeleteDialog = new TbgrDeleteDialog();
    expect(await tbgrDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Tbgr?');
    await tbgrDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(tbgrComponentsPage.title), 5000);

    expect(await tbgrComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
