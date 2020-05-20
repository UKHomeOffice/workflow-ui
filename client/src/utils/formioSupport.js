import FormioUtils from 'formiojs/utils';

/*eslint-disable */
export const interpolate = (form, submission) => {
  FormioUtils.eachComponent(form.components, (component) => {
    if (component.type === 'file' && component.url !== '') {
      component.url = FormioUtils.interpolate(component.url, {
        data: submission,
      });
    }
    if (component.type === 'select' && component.data.url !== '') {
      component.data.url = FormioUtils.interpolate(component.data.url, {
        data: submission,
      });
    }
    component.label = FormioUtils.interpolate(component.label, {
      data: submission,
    });
    if (component.type === 'content') {
      component.html = FormioUtils.interpolate(component.html, {
        data: submission,
      });
    }
    if (component.type === 'htmlelement') {
      component.content = FormioUtils.interpolate(component.content, {
        data: submission,
      });
    }
    if (component.defaultValue) {
      component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
        data: submission,
      });
    }
    if (component.customDefaultValue && component.customDefaultValue !== '') {
      component.defaultValue = FormioUtils.evaluate(component.customDefaultValue, {
        data: submission,
      }, 'value');
      component.customDefaultValue = '';
    }
  });
  /* eslint-enable */
};
