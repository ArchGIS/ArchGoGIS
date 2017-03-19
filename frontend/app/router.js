import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('graph-builder');
  this.route('map-builder');
  this.route('table-loader');
  this.route('vector-uploader');
  this.route('big-search');
  this.route('data-builder');
  this.route('fast-search');
  this.route('admin-panel');
});

export default Router;
