var Parser = require('./parser'),
Slide = require('./slide');

var macros = {
    hello : 'hello!'
};
var options = {

};

module.exports = Creator;

function Creator () { }

Creator.prototype.createSlides = function (slideshowSource) {
    var parser = new Parser()
     ,  parsedSlides = parser.parse(slideshowSource, macros, options)
      , slides = []
      , byName = {}
      , layoutSlide
      ;
  
    slides.byName = {};
    slides.byNumber = {};
  
    var slideNumber = 0;
    parsedSlides.forEach(function (slide, i) {
      var template, slideViewModel;
  
      if (slide.properties.continued === 'true' && i > 0) {
        template = slides[slides.length - 1];
      }
      else if (byName[slide.properties.template]) {
        template = byName[slide.properties.template];
      }
      else if (slide.properties.layout === 'false') {
        layoutSlide = undefined;
      }
      else if (layoutSlide && slide.properties.layout !== 'true') {
        template = layoutSlide;
      }
  
      if (slide.properties.continued === 'true' &&
          options.countIncrementalSlides === false &&
          slide.properties.count === undefined) {
        slide.properties.count = 'false';
      }
  
      var slideClasses = (slide.properties['class'] || '').split(/,| /)
        , excludedClasses = options.excludedClasses || []
        , slideIsIncluded = slideClasses.filter(function (c) {
            return excludedClasses.indexOf(c) !== -1;
          }).length === 0;
  
      if (slideIsIncluded && slide.properties.layout !== 'true' && slide.properties.count !== 'false') {
        slideNumber++;
        slides.byNumber[slideNumber] = [];
      }
  
      slideViewModel = new Slide(slides.length, slideNumber, slide, template);
  
      if (slide.properties.name) {
        byName[slide.properties.name] = slideViewModel;
      }
  
      if (slide.properties.layout === 'true') {
        layoutSlide = slideViewModel;
      } else {
        if (slideIsIncluded) {
          slides.push(slideViewModel);
          slides.byNumber[slideNumber].push(slideViewModel);
        }
        if (slide.properties.name) {
          slides.byName[slide.properties.name] = slideViewModel;
        }
      }
  
    });
  
    return slides.map( s => {
      let actions, notes = [];

      if(s.properties.actions && s.properties.actions.length){
        actions = s.properties.actions.split(',').map(a => { 
          const type = a.trim().substr(1, a.indexOf(']') - 1);
          const title = a.trim().substr(a.indexOf(']') + 1);

          return {type, title}
        });
      }
      
      if(s.properties.notes && s.properties.notes.length){
        notes = s.properties.notes.split(',').map(a => { 
          const title = a.trim().substr(1, a.indexOf(']') - 1);
          const body = a.trim().substr(a.indexOf(']') + 1);

          return {title, body}
        });
      }

      return {
        name: s.properties.name || 'Untitled',
        actions,
        notes
      }
    });
  }