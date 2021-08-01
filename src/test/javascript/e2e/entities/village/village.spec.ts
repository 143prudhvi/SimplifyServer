import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { VillageComponentsPage, VillageDeleteDialog, VillageUpdatePage } from './village.page-object';

const expect = chai.expect;

describe('Village e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let villageComponentsPage: VillageComponentsPage;
  let villageUpdatePage: VillageUpdatePage;
  let villageDeleteDialog: VillageDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Villages', async () => {
    await navBarPage.goToEntity('village');
    villageComponentsPage = new VillageComponentsPage();
    await browser.wait(ec.visibilityOf(villageComponentsPage.title), 5000);
    expect(await villageComponentsPage.getTitle()).to.eq('Villages');
    await browser.wait(ec.or(ec.visibilityOf(villageComponentsPage.entities), ec.visibilityOf(villageComponentsPage.noResult)), 1000);
  });

  it('should load create Village page', async () => {
    await villageComponentsPage.clickOnCreateButton();
    villageUpdatePage = new VillageUpdatePage();
    expect(await villageUpdatePage.getPageTitle()).to.eq('Create or edit a Village');
    await villageUpdatePage.cancel();
  });

  it('should create and save Villages', async () => {
    const nbButtonsBeforeCreate = await villageComponentsPage.countDeleteButtons();

    await villageComponentsPage.clickOnCreateButton();

    await promise.all([villageUpdatePage.setBoardInput('board'), villageUpdatePage.setVillageInput('village')]);

    await villageUpdatePage.save();
    expect(await villageUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await villageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Village', async () => {
    const nbButtonsBeforeDelete = await villageComponentsPage.countDeleteButtons();
    await villageComponentsPage.clickOnLastDeleteButton();

    villageDeleteDialog = new VillageDeleteDialog();
    expect(await villageDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Village?');
    await villageDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(villageComponentsPage.title), 5000);

    expect(await villageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
