/*
Copyright (c) 2018 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow
import * as React from 'react';
import {STATE_CHANGE_TYPE} from './constants.js';
import type {
  CalendarPropsT,
  ContainerStateT,
  DatepickerPropsT,
  StatefulContainerPropsT,
  StateChangeTypeT,
  StateReducerT,
} from './types.js';

const defaultStateReducer: StateReducerT = (type, nextState) => nextState;

class StatefulContainer extends React.Component<
  StatefulContainerPropsT<CalendarPropsT | DatepickerPropsT>,
  ContainerStateT,
> {
  static defaultProps = {
    initialState: {value: null, time: null},
    stateReducer: defaultStateReducer,
    onChange: () => {},
  };

  state = {
    ...{
      value: null,
      time: null,
    },
    ...this.props.initialState,
  };

  onChange = (data: {date: ?Date | Array<Date>}) => {
    const {date} = data;
    this.internalSetState(STATE_CHANGE_TYPE.change, {value: date});
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data);
    }
  };

  onTimeChange = (data: {time: Date | Array<Date>}) => {
    const {time} = data;
    this.internalSetState(STATE_CHANGE_TYPE.change, {time});
    if (typeof this.props.onTimeChange === 'function') {
      this.props.onTimeChange(data);
    }
  };

  internalSetState(type: StateChangeTypeT, changes: ContainerStateT) {
    const {stateReducer} = this.props;
    this.setState(prevState => stateReducer(type, changes, prevState));
  }

  render() {
    const {children, initialState, stateReducer, ...rest} = this.props;
    // $FlowFixMe
    return this.props.children({
      ...rest,
      value: this.state.value,
      time: this.state.time,
      onChange: this.onChange,
      onTimeChange: this.onTimeChange,
    });
  }
}

export default StatefulContainer;
