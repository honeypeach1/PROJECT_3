<template>
  <modal>
  <div class="overlay" @click="$emit('windChart-close')"></div>
    <div id="windCountGraph">
      <table>
        <thead>
        <tr class="head_title">
          <th>m/s</th>
          <th>0.5~</th>
          <th>1.0~</th>
          <th>1.5~</th>
          <th>2.0~</th>
          <th>2.5~</th>
          <th>3.0~</th>
          <th>3.5~</th>
          <th>합계</th>
        </tr>
        <tr class="head_subTitle">
          <th></th>
          <th class="legend_1"></th>
          <th class="legend_2"></th>
          <th class="legend_3"></th>
          <th class="legend_4"></th>
          <th class="legend_5"></th>
          <th class="legend_6"></th>
          <th class="legend_7"></th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr class="odd_row">
          <td class="windDirect_1">N</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_2">NNE</td>
          <td></td>
          <td></td>
          <td>3</td>
          <td></td>
          <td>2</td>
          <td></td>
          <td>1</td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_3">NE</td>
          <td>5</td>
          <td></td>
          <td></td>
          <td>3</td>
          <td></td>
          <td></td>
          <td>2</td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_4">ENE</td>
          <td></td>
          <td>1</td>
          <td></td>
          <td>2</td>
          <td></td>
          <td>3</td>
          <td></td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_5">E</td>
          <td>4</td>
          <td></td>
          <td></td>
          <td>5</td>
          <td></td>
          <td>15</td>
          <td></td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_6">ESE</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>4</td>
          <td>32</td>
          <td>2</td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_7">SE</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>3</td>
          <td>5</td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_8">SSE</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_9">S</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_10">SSW</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_11">SW</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_12">WSW</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_13">W</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_14">WNW</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="odd_row">
          <td class="windDirect_15">NW</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="even_row">
          <td class="windDirect_16">NNW</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  </modal>
</template>

<style lang="scss" scoped>
@import "../../assets/style/popup/windChartPopup";
</style>
